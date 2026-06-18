import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import {
  createId,
  ensureDemoStorage,
  getBusinesses,
  getCategories,
  getCities,
  getFavorites,
  getProducts,
  getRequests,
  getUsers,
  resetDemoStorage,
  saveBusinesses,
  saveFavorites,
  saveProducts,
  saveRequests,
  saveUsers
} from "../services/storage";
import type {
  Business,
  BusinessProfileValues,
  CustomerRequest,
  FavoriteState,
  Product,
  ProductFormValues,
  RequestFormValues,
  RequestStatus,
  User
} from "../types";

interface RegistrationBusinessValues {
  ownerId: string;
  name: string;
  category: string;
  city: string;
  phone: string;
  email: string;
}

interface DataContextValue {
  loading: boolean;
  categories: string[];
  cities: string[];
  businesses: Business[];
  products: Product[];
  users: User[];
  requests: CustomerRequest[];
  favorites: FavoriteState;
  resetDemoData: () => void;
  addUser: (user: User) => boolean;
  addBusinessForOwner: (values: RegistrationBusinessValues) => Business;
  updateBusiness: (businessId: string, values: Partial<BusinessProfileValues>) => void;
  updateBusinessAdminState: (businessId: string, values: Partial<Pick<Business, "approved" | "verified" | "active">>) => void;
  recordBusinessView: (businessId: string) => void;
  addProduct: (businessId: string, values: ProductFormValues) => Product;
  updateProduct: (productId: string, values: ProductFormValues) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  addRequest: (values: RequestFormValues, businessId: string, productId?: string, customerId?: string) => CustomerRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  toggleFavoriteBusiness: (businessId: string) => void;
  toggleFavoriteProduct: (productId: string) => void;
  isFavoriteBusiness: (businessId: string) => boolean;
  isFavoriteProduct: (productId: string) => boolean;
}

const defaultDataContext: DataContextValue = {
  loading: false,
  categories: [],
  cities: [],
  businesses: [],
  products: [],
  users: [],
  requests: [],
  favorites: { businessIds: [], productIds: [] },
  resetDemoData: () => undefined,
  addUser: () => false,
  addBusinessForOwner: () => {
    throw new Error("Податоците не се подготвени.");
  },
  updateBusiness: () => undefined,
  updateBusinessAdminState: () => undefined,
  recordBusinessView: () => undefined,
  addProduct: () => {
    throw new Error("Податоците не се подготвени.");
  },
  updateProduct: () => undefined,
  deleteProduct: () => undefined,
  toggleProductAvailability: () => undefined,
  addRequest: () => {
    throw new Error("Податоците не се подготвени.");
  },
  updateRequestStatus: () => undefined,
  toggleFavoriteBusiness: () => undefined,
  toggleFavoriteProduct: () => undefined,
  isFavoriteBusiness: () => false,
  isFavoriteProduct: () => false
};

export const DataContext = createContext<DataContextValue>(defaultDataContext);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  ensureDemoStorage();

  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>(() => getBusinesses());
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [requests, setRequests] = useState<CustomerRequest[]>(() => getRequests());
  const [favorites, setFavorites] = useState<FavoriteState>(() => getFavorites());
  const categories = useMemo(() => getCategories(), []);
  const cities = useMemo(() => getCities(), []);

  const replaceBusinesses = useCallback((updater: (current: Business[]) => Business[]) => {
    setBusinesses((current) => {
      const next = updater(current);
      saveBusinesses(next);
      return next;
    });
  }, []);

  const replaceProducts = useCallback((updater: (current: Product[]) => Product[]) => {
    setProducts((current) => {
      const next = updater(current);
      saveProducts(next);
      return next;
    });
  }, []);

  const replaceUsers = useCallback((updater: (current: User[]) => User[]) => {
    setUsers((current) => {
      const next = updater(current);
      saveUsers(next);
      return next;
    });
  }, []);

  const replaceRequests = useCallback((updater: (current: CustomerRequest[]) => CustomerRequest[]) => {
    setRequests((current) => {
      const next = updater(current);
      saveRequests(next);
      return next;
    });
  }, []);

  const replaceFavorites = useCallback((updater: (current: FavoriteState) => FavoriteState) => {
    setFavorites((current) => {
      const next = updater(current);
      saveFavorites(next);
      return next;
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setLoading(true);
    resetDemoStorage();
    setBusinesses(getBusinesses());
    setProducts(getProducts());
    setUsers(getUsers());
    setRequests(getRequests());
    setFavorites(getFavorites());
    window.dispatchEvent(new Event("lokalno:reset"));
    window.setTimeout(() => setLoading(false), 250);
  }, []);

  const addUser = useCallback(
    (user: User) => {
      const exists = users.some(
        (candidate) => candidate.email.toLocaleLowerCase("mk-MK") === user.email.toLocaleLowerCase("mk-MK")
      );

      if (exists) {
        return false;
      }

      replaceUsers((current) => [...current, user]);
      return true;
    },
    [replaceUsers, users]
  );

  const addBusinessForOwner = useCallback(
    (values: RegistrationBusinessValues) => {
      const newBusiness: Business = {
        id: createId("biz"),
        ownerId: values.ownerId,
        name: values.name,
        category: values.category,
        city: values.city,
        address: "Адреса ќе биде додадена",
        description: "Нов локален бизнис кој наскоро ќе го дополни својот профил.",
        rating: 0,
        verified: false,
        approved: false,
        active: true,
        featured: false,
        views: 0,
        phone: values.phone,
        email: values.email,
        hours: "Понеделник - Петок, 09:00 - 17:00",
        logoUrl: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=300&q=80",
        coverUrl: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1400&q=80",
        keywords: [values.name, values.category, values.city]
      };

      replaceBusinesses((current) => [...current, newBusiness]);
      replaceUsers((current) =>
        current.map((user) => (user.id === values.ownerId ? { ...user, businessId: newBusiness.id } : user))
      );
      return newBusiness;
    },
    [replaceBusinesses, replaceUsers]
  );

  const updateBusiness = useCallback(
    (businessId: string, values: Partial<BusinessProfileValues>) => {
      replaceBusinesses((current) =>
        current.map((business) =>
          business.id === businessId
            ? {
                ...business,
                ...values,
                keywords: [values.name ?? business.name, values.category ?? business.category, values.city ?? business.city]
              }
            : business
        )
      );
    },
    [replaceBusinesses]
  );

  const updateBusinessAdminState = useCallback(
    (businessId: string, values: Partial<Pick<Business, "approved" | "verified" | "active">>) => {
      replaceBusinesses((current) =>
        current.map((business) => (business.id === businessId ? { ...business, ...values } : business))
      );
    },
    [replaceBusinesses]
  );

  const recordBusinessView = useCallback(
    (businessId: string) => {
      replaceBusinesses((current) =>
        current.map((business) =>
          business.id === businessId ? { ...business, views: business.views + 1 } : business
        )
      );
    },
    [replaceBusinesses]
  );

  const addProduct = useCallback(
    (businessId: string, values: ProductFormValues) => {
      const business = businesses.find((candidate) => candidate.id === businessId);
      const newProduct: Product = {
        id: createId("prod"),
        businessId,
        name: values.name,
        category: values.category,
        city: business?.city ?? "Скопје",
        description: values.description,
        price: values.price,
        imageUrl: values.imageUrl,
        available: values.available,
        featured: values.featured
      };

      replaceProducts((current) => [newProduct, ...current]);
      return newProduct;
    },
    [businesses, replaceProducts]
  );

  const updateProduct = useCallback(
    (productId: string, values: ProductFormValues) => {
      replaceProducts((current) =>
        current.map((product) => (product.id === productId ? { ...product, ...values } : product))
      );
    },
    [replaceProducts]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      replaceProducts((current) => current.filter((product) => product.id !== productId));
      replaceFavorites((current) => ({
        ...current,
        productIds: current.productIds.filter((id) => id !== productId)
      }));
    },
    [replaceFavorites, replaceProducts]
  );

  const toggleProductAvailability = useCallback(
    (productId: string) => {
      replaceProducts((current) =>
        current.map((product) => (product.id === productId ? { ...product, available: !product.available } : product))
      );
    },
    [replaceProducts]
  );

  const addRequest = useCallback(
    (values: RequestFormValues, businessId: string, productId?: string, customerId?: string) => {
      const newRequest: CustomerRequest = {
        id: createId("req"),
        type: productId ? "product" : "contact",
        customerId,
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        businessId,
        productId,
        quantity: productId ? values.quantity : undefined,
        message: values.message,
        status: "Испратено",
        createdAt: new Date().toISOString()
      };

      replaceRequests((current) => [newRequest, ...current]);
      return newRequest;
    },
    [replaceRequests]
  );

  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus) => {
      replaceRequests((current) =>
        current.map((request) => (request.id === requestId ? { ...request, status } : request))
      );
    },
    [replaceRequests]
  );

  const toggleFavoriteBusiness = useCallback(
    (businessId: string) => {
      replaceFavorites((current) => {
        const isFavorite = current.businessIds.includes(businessId);
        return {
          ...current,
          businessIds: isFavorite
            ? current.businessIds.filter((id) => id !== businessId)
            : [...current.businessIds, businessId]
        };
      });
    },
    [replaceFavorites]
  );

  const toggleFavoriteProduct = useCallback(
    (productId: string) => {
      replaceFavorites((current) => {
        const isFavorite = current.productIds.includes(productId);
        return {
          ...current,
          productIds: isFavorite ? current.productIds.filter((id) => id !== productId) : [...current.productIds, productId]
        };
      });
    },
    [replaceFavorites]
  );

  const isFavoriteBusiness = useCallback(
    (businessId: string) => favorites.businessIds.includes(businessId),
    [favorites.businessIds]
  );

  const isFavoriteProduct = useCallback(
    (productId: string) => favorites.productIds.includes(productId),
    [favorites.productIds]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      loading,
      categories,
      cities,
      businesses,
      products,
      users,
      requests,
      favorites,
      resetDemoData,
      addUser,
      addBusinessForOwner,
      updateBusiness,
      updateBusinessAdminState,
      recordBusinessView,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductAvailability,
      addRequest,
      updateRequestStatus,
      toggleFavoriteBusiness,
      toggleFavoriteProduct,
      isFavoriteBusiness,
      isFavoriteProduct
    }),
    [
      addBusinessForOwner,
      addProduct,
      addRequest,
      addUser,
      businesses,
      categories,
      cities,
      deleteProduct,
      favorites,
      isFavoriteBusiness,
      isFavoriteProduct,
      loading,
      products,
      recordBusinessView,
      requests,
      resetDemoData,
      toggleFavoriteBusiness,
      toggleFavoriteProduct,
      toggleProductAvailability,
      updateBusiness,
      updateBusinessAdminState,
      updateProduct,
      updateRequestStatus,
      users
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
