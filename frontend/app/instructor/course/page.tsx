import UI from "./UI";


export default async function InstructorCoursesPage() {
  const { data: courses } = await getAllInstructorCourses();

  return <UI courses={courses ?? []} />;
}