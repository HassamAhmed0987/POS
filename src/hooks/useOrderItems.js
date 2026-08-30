import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { orderItemApi } from "../services/orderItemApi";

export const useOrderItems = (orderId = null) => {
  const queryClient = useQueryClient();

  // Get order items
  const orderItemsQuery = useQuery({
    queryKey: ["orderItems", orderId || "all"],

    queryFn: () =>
      orderId
        ? orderItemApi.getByOrderId(orderId)
        : orderItemApi.getAll(),

    enabled: orderId !== undefined,
  });

  // Create single order item
  const createOrderItemMutation = useMutation({
    mutationFn: (newItem) =>
      orderItemApi.create(newItem),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });

  // Create multiple order items
  const createBulkOrderItemsMutation = useMutation({
    mutationFn: async (items) => {
      const promises = items.map((item) =>
        orderItemApi.create(item)
      );

      return Promise.all(promises);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });

  // Delete order item
  const deleteOrderItemMutation = useMutation({
    mutationFn: (id) =>
      orderItemApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orderItems"],
      });
    },
  });

  return {
    ...orderItemsQuery,

    orderItems: orderItemsQuery.data || [],

    createOrderItem:
      createOrderItemMutation.mutateAsync,

    createBulkOrderItems:
      createBulkOrderItemsMutation.mutateAsync,

    deleteOrderItem:
      deleteOrderItemMutation.mutateAsync,

    isCreating:
      createOrderItemMutation.isPending ||
      createBulkOrderItemsMutation.isPending,

    isDeleting:
      deleteOrderItemMutation.isPending,
  };
};
