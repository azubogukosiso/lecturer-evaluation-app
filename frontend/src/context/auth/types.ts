export type AuthContextType = {
  user: {
    id: string;
    emailAddress: string;
    role: string;
  } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{
      id: string;
      emailAddress: string;
      role: string;
    } | null>
  >;
  loadingUser: boolean;
  setLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
};
