import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";

interface CategoryNavProps {
  selectedCategory?: number;
  onCategoryChange: (categoryId?: number) => void;
}

export default function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          <button
            onClick={() => onCategoryChange(undefined)}
            className={`whitespace-nowrap text-sm font-medium transition-colors pb-2 ${
              selectedCategory === undefined
                ? "text-primary border-b-2 border-primary"
                : "text-slate-600 hover:text-primary"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap text-sm font-medium transition-colors pb-2 ${
                selectedCategory === category.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
