export interface Launch {
  flight_number: number;
  mission_name: string;
  launch_date_local: string;
  launch_success: boolean | null;
  upcoming: boolean;
  details: string | null;
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
  launch_site: {
    site_name: string;
    site_name_long: string;
  };
  links: {
    mission_patch: string | null;
    mission_patch_small: string | null;
    article_link: string | null;
    video_link: string | null;
    wikipedia: string | null;
  };
}
