import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryApi";

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Get Categories
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  });

  // Create Category
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  // Update Category
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  // Toggle Category Status
  const toggleCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      categoryApi.patch(id, { isActive }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  // Delete Category
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return {
    // Categories Query
    ...categoriesQuery,
    categories: categoriesQuery.data || [],

    // Mutations
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    toggleCategoryStatus: toggleCategoryStatusMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,

    // Loading States
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isToggling: toggleCategoryStatusMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
