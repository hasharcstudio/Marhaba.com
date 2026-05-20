-- Enable PostGIS for geospatial queries (if available, otherwise we use standard haversine formula)
-- We will use a standard haversine formula for simplicity if PostGIS isn't enabled.
create or replace function calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
returns float as $$
declare
    R float := 6371; -- Earth radius in km
    dlat float;
    dlon float;
    a float;
    c float;
begin
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    return R * c;
end;
$$ language plpgsql;

create or replace function get_potential_matches(p_user_id uuid, p_limit int default 20)
returns table (
  id uuid,
  name text,
  age int,
  profession text,
  location text,
  avatar_url text,
  is_blur_default boolean,
  prompt_question text,
  prompt_answer text,
  distance_km float
) as $$
declare
  v_user_lat float;
  v_user_lon float;
  v_min_age int;
  v_max_age int;
  v_pref_gender text;
  v_max_dist int;
begin
  -- Get current user's location and preferences
  select p.latitude, p.longitude into v_user_lat, v_user_lon from profiles p where p.id = p_user_id;
  
  select pref.min_age, pref.max_age, pref.preferred_gender, pref.max_distance_km
  into v_min_age, v_max_age, v_pref_gender, v_max_dist
  from preferences pref
  where pref.user_id = p_user_id;

  -- Defaults if no preferences set
  v_min_age := coalesce(v_min_age, 18);
  v_max_age := coalesce(v_max_age, 100);
  v_max_dist := coalesce(v_max_dist, 100);

  return query
  select 
    p.id,
    p.name,
    extract(year from age(p.birthdate))::int as age,
    p.profession,
    p.location,
    p.avatar_url,
    p.is_blur_default,
    p.prompt_question,
    p.prompt_answer,
    -- Distance calculation
    calculate_distance(v_user_lat, v_user_lon, p.latitude, p.longitude) as distance_km
  from profiles p
  where 
    p.id != p_user_id
    -- Not swiped yet
    and not exists (
      select 1 from swipes s where s.swiper_id = p_user_id and s.swiped_id = p.id
    )
    -- Not blocked
    and not exists (
      select 1 from blocked_users bu where (bu.blocker_id = p_user_id and bu.blocked_id = p.id) or (bu.blocker_id = p.id and bu.blocked_id = p_user_id)
    )
    -- Match basic age criteria
    and extract(year from age(p.birthdate))::int between v_min_age and v_max_age
    -- Match gender if preference exists
    and (v_pref_gender is null or p.gender = v_pref_gender)
    -- Basic distance filter (rough optimization can be added later)
    and calculate_distance(v_user_lat, v_user_lon, p.latitude, p.longitude) <= v_max_dist
  order by random() -- For now, random sort. Later we sort by score.
  limit p_limit;
end;
$$ language plpgsql security definer;
