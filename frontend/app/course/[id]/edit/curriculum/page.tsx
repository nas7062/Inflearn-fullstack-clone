import { getCourseById } from "@/lib/api";
import EditCurriculumUI from "./UI";
import { notFound } from "next/navigation";

export default async function EditCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <EditCurriculumUI initialCourse={course.data} />;
}
