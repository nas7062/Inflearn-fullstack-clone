import { getAllInstructorCourses } from "@/lib/api";
import UI from "./UI";

export default async function InstructorCoursesPage() {
  const courses = await getAllInstructorCourses();

  return <UI courses={courses ?? []} />;
}
