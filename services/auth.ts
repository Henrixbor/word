export const authService = {
  login: async (email: string, password: string) => {
    return { id: "user-1", name: email.split("@")[0] || "Player" };
  },
  register: async (email: string, password: string) => {
    return { id: "user-1", name: email.split("@")[0] || "Player" };
  },
};
