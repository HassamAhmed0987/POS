import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { settingsApi } from "../services/settingsApi";

const defaultSettings = {
  restaurantName: "CRISP & GRILL EXPRESS",
  tagline: "Fast, Hot & Fresh Food",

  logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&auto=format&fit=crop&q=80",

  address:
    "Plot 42, Food Street, Clifton Block 5, Karachi, Pakistan",

  phone: "03001234567",
  email: "orders@crispandgrill.com",

  openingTime: "11:00 AM",
  closingTime: "02:00 AM",

  minimumOrder: 300,
  deliveryCharges: 150,

  acceptCash: true,
  acceptCard: true,
  acceptOnline: true,

  adminProfile: {
    name: "Daniyal Khan",
    email: "admin@crispandgrill.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  // Get settings
  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });

  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings) =>
      settingsApi.update(newSettings),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
  });

  return {
    ...settingsQuery,

    settings:
      settingsQuery.data || defaultSettings,

    updateSettings:
      updateSettingsMutation.mutateAsync,

    isUpdating:
      updateSettingsMutation.isPending,
  };
};