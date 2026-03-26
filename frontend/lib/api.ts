"use server";

import {
  categoriesControllerFindAll,
  CourseResponseDto,
  coursesControllerFindAll,
} from "@/generated/openapi-client";

export const getAllCategories = async () => {
  const { data, error } = await categoriesControllerFindAll();
  return { data, error };
};

export async function getAllInstructorCourses(): Promise<
  CourseResponseDto[] | undefined
> {
  const response = await coursesControllerFindAll();

  return response.data ?? [];
}
