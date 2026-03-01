export const pointsService = {
  async getBundles() {
    return [
      { id: "bundle-1", points: 500, price: "$2.99" },
      { id: "bundle-2", points: 1200, price: "$5.99" },
      { id: "bundle-3", points: 3000, price: "$12.99" },
    ];
  },
  async getVipOffer() {
    return { id: "vip", price: "$4.99/mo", perks: ["2x Points", "Exclusive badges"] };
  },
};
