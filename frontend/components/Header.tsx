import { CategoryDto } from "@/generated/openapi-client";
import Link from "next/link";

export default function Header({ categories }: { categories: CategoryDto[] }) {
  return (
    <header>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
