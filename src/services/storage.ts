import businessesJson from "../data/businesses.json";
import categoriesJson from "../data/categories.json";
import citiesJson from "../data/cities.json";
import productsJson from "../data/products.json";
import requestsJson from "../data/requests.json";
import usersJson from "../data/users.json";
import type { Business, CustomerRequest, FavoriteState, Product, User } from "../types";

const STORAGE_PREFIX = "lokalno_plus_";

const keys = {
  initialized: `${STORAGE_PREFIX}initialized`,
  businesses: `${STORAGE_PREFIX}businesses`,
  products: `${STORAGE_PREFIX}products`,
  users: `${STORAGE_PREFIX}users`,
  requests: `${STORAGE_PREFIX}requests`,
  favorites: `${STORAGE_PREFIX}favorites`,
  currentUser: `${STORAGE_PREFIX}current_user`
};

const seedBusinesses = businessesJson as unknown as Business[];
const seedProducts = productsJson as unknown as Product[];
const seedUsers = usersJson as unknown as User[];
const seedRequests = requestsJson as unknown as CustomerRequest[];
const seedCategories = categoriesJson as unknown as string[];
const seedCities = citiesJson as unknown as string[];

const defaultFavorites: FavoriteState = {
  businessIds: [],
  productIds: []
};

const removedProductIds = ["prod-15", "prod-19"];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const readStorage = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

const migrateDemoStorage = () => {
  const storedProducts = readStorage<Product[]>(keys.products, []);
  const nextProducts = storedProducts.filter((product) => !removedProductIds.includes(product.id));

  if (nextProducts.length !== storedProducts.length) {
    writeStorage(keys.products, nextProducts);
  }

  const storedFavorites = readStorage<FavoriteState>(keys.favorites, defaultFavorites);
  const nextFavoriteProductIds = storedFavorites.productIds.filter((id) => !removedProductIds.includes(id));

  if (nextFavoriteProductIds.length !== storedFavorites.productIds.length) {
    writeStorage(keys.favorites, {
      ...storedFavorites,
      productIds: nextFavoriteProductIds
    });
  }
};

export const getSeedData = () => ({
  businesses: clone(seedBusinesses),
  products: clone(seedProducts),
  users: clone(seedUsers),
  requests: clone(seedRequests),
  favorites: clone(defaultFavorites)
});

export const getCategories = () => clone(seedCategories);

export const getCities = () => clone(seedCities);

export const resetDemoStorage = () => {
  const seedData = getSeedData();
  writeStorage(keys.businesses, seedData.businesses);
  writeStorage(keys.products, seedData.products);
  writeStorage(keys.users, seedData.users);
  writeStorage(keys.requests, seedData.requests);
  writeStorage(keys.favorites, seedData.favorites);
  writeStorage(keys.initialized, true);
  writeStorage(keys.currentUser, null);
};

export const ensureDemoStorage = () => {
  if (!canUseStorage()) {
    return;
  }

  if (!window.localStorage.getItem(keys.initialized)) {
    resetDemoStorage();
  } else {
    migrateDemoStorage();
  }
};

export const getBusinesses = () => {
  ensureDemoStorage();
  return readStorage<Business[]>(keys.businesses, getSeedData().businesses);
};

export const saveBusinesses = (businesses: Business[]) => {
  writeStorage(keys.businesses, businesses);
};

export const getProducts = () => {
  ensureDemoStorage();
  return readStorage<Product[]>(keys.products, getSeedData().products);
};

export const saveProducts = (products: Product[]) => {
  writeStorage(keys.products, products);
};

export const getUsers = () => {
  ensureDemoStorage();
  return readStorage<User[]>(keys.users, getSeedData().users);
};

export const saveUsers = (users: User[]) => {
  writeStorage(keys.users, users);
};

export const getRequests = () => {
  ensureDemoStorage();
  return readStorage<CustomerRequest[]>(keys.requests, getSeedData().requests);
};

export const saveRequests = (requests: CustomerRequest[]) => {
  writeStorage(keys.requests, requests);
};

export const getFavorites = () => {
  ensureDemoStorage();
  return readStorage<FavoriteState>(keys.favorites, defaultFavorites);
};

export const saveFavorites = (favorites: FavoriteState) => {
  writeStorage(keys.favorites, favorites);
};

export const getCurrentUser = () => readStorage<User | null>(keys.currentUser, null);

export const saveCurrentUser = (user: User | null) => {
  writeStorage(keys.currentUser, user);
};

export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
