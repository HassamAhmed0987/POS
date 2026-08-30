// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { productApi } from "../services/productApi";

// export const useProducts = (params = {}) => {
//   const queryClient = useQueryClient();

//   const productsQuery = useQuery({
//     queryKey: ["products", params],
//     queryFn: () => productApi.getAll(params),
//   });

//   const createProductMutation = useMutation({
//     mutationFn: (newProduct) => productApi.create(newProduct),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const updateProductMutation = useMutation({
//     mutationFn: ({ id, data }) => productApi.update(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const toggleAvailabilityMutation = useMutation({
//     mutationFn: ({ id, isAvailable }) => productApi.patch(id, { isAvailable }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const deleteProductMutation = useMutation({
//     mutationFn: (id) => productApi.delete(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   return {
//     ...productsQuery,
//     products: productsQuery.data || [],
//     createProduct: createProductMutation.mutateAsync,
//     updateProduct: updateProductMutation.mutateAsync,
//     toggleAvailability: toggleAvailabilityMutation.mutateAsync,
//     deleteProduct: deleteProductMutation.mutateAsync,
//     isCreating: createProductMutation.isPending,
//     isUpdating: updateProductMutation.isPending,
//     isDeleting: deleteProductMutation.isPending,
//   };
// };

// export const useProduct = (id) => {
//   return useQuery({
//     queryKey: ["product", id],
//     queryFn: () => productApi.getById(id),
//     enabled: !!id,
//   });
// };


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../services/productApi";

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Get all products
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // Create product
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Toggle product availability
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }) =>
      productApi.patch(id, { isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    // Query
    ...productsQuery,
    products: productsQuery.data || [],

    // Mutations
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    toggleAvailability: toggleAvailabilityMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,

    // Loading states
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

