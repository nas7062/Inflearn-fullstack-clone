import { notFound } from "next/navigation";

import { getCourseById } from "@/lib/api";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <UI course={course.data} />;
}
