import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { customerApi } from "../services/customerApi";

export const useCustomers = (params = {}) => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerApi.getAll(params),
  });

  const createCustomerMutation = useMutation({
    mutationFn: (newCustomer) => customerApi.create(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }) => customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id) => customerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });

  return {
    ...customersQuery,

    customers: customersQuery.data || [],

    createCustomer: createCustomerMutation.mutateAsync,
    updateCustomer: updateCustomerMutation.mutateAsync,
    deleteCustomer: deleteCustomerMutation.mutateAsync,

    isCreating: createCustomerMutation.isPending,
    isUpdating: updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
  };
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerApi.getById(id),
    enabled: !!id,
  });
};
