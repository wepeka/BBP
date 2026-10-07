/** The few project fields the maps need (keeps the page payload small). */
export interface MapProject {
  id: string;
  slug: string;
  titleId: string;
  year: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
}

export function toMapProjects<T extends MapProject>(projects: T[]): MapProject[] {
  return projects.map(({ id, slug, titleId, year, city, province, lat, lng }) => ({ id, slug, titleId, year, city, province, lat, lng }));
}
