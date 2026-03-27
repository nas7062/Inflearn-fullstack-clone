"use server";

import {
  categoriesControllerFindAll,
  CourseResponseDto,
  coursesControllerCreate,
  coursesControllerFindAll,
  coursesControllerFindOne,
  coursesControllerUpdate,
  UpdateCourseDto,
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

export const getCourseById = async (id: string) => {
  const { data, error } = await coursesControllerFindOne({
    path: {
      id,
    },
  });

  return {
    data,
    error,
  };
};

export const createCourse = async (title: string) => {
  const { data, error } = await coursesControllerCreate({
    body: {
      title,
    },
  });

  return {
    data,
    error,
  };
};

export const updateCourse = async (
  id: string,
  updateCourseDto: UpdateCourseDto,
) => {
  const { data, error } = await coursesControllerUpdate({
    path: {
      id,
    },
    body: updateCourseDto,
  });

  return { data, error };
};
