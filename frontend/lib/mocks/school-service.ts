import schoolsData from "@/data/schools.json";

export interface School {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  location: string;
  tuition: string;
  registration_fields: any[];
}

export const schoolService = {
  getSchools: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return schoolsData as School[];
  },

  getSchoolBySlug: async (slug: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return (schoolsData as School[]).find((s) => s.slug === slug);
  },
};
