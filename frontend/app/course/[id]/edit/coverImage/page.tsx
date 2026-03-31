import { getCourseById } from "@/lib/api";
import { notFound } from "next/navigation";
import CoverImageUI from "./UI";

export default async function EditCourseCoverImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <CoverImageUI course={course.data} />;
}
