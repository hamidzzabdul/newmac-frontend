export const loadCart = () => {
    if (typeof window === "undefined") return undefined;
  
    try {
      const serialized = localStorage.getItem("cart");
      if (!serialized) return undefined;
      return JSON.parse(serialized);
    } catch (e) {
      console.log("Load cart error:", e);
      return undefined;
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const saveCart = (state: any) => {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem("cart", serialized);
    } catch (e) {
      console.log("Save cart error:", e);
    }
  };
  