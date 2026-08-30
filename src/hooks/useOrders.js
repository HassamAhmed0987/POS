import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { orderApi } from "../services/orderApi";

export const useOrders = (params = {}) => {
  const queryClient = useQueryClient();

  // Get orders
  const ordersQuery = useQuery({
    queryKey: ["orders", params],
    queryFn: () => orderApi.getAll(params),
  });

  // Create order
  const createOrderMutation = useMutation({
    mutationFn: (newOrder) => orderApi.create(newOrder),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  // Update order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      orderApi.patch(id, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // Update payment status
  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ id, paymentStatus }) =>
      orderApi.patch(id, { paymentStatus }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // Update complete order
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) =>
      orderApi.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // Delete order
  const deleteOrderMutation = useMutation({
    mutationFn: (id) => orderApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });

  return {
    ...ordersQuery,

    orders: ordersQuery.data || [],

    createOrder: createOrderMutation.mutateAsync,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    updatePaymentStatus: updatePaymentStatusMutation.mutateAsync,
    updateOrder: updateOrderMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,

    isCreating: createOrderMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isUpdatingPayment: updatePaymentStatusMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
  };
};

// Get single order
export const useOrder = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
};
