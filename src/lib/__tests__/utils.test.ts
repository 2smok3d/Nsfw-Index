import { cn, slugify } from "../utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("returns empty string when all falsy", () => {
    expect(cn(false, undefined, null)).toBe("");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("foo bar baz")).toBe("foo-bar-baz");
  });

  it("removes special characters", () => {
    expect(slugify("hello! world?")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });
});
