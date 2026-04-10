import type { SearchInputProps } from "@/shared/types";

export function SearchInput({
  defaultValue,
  placeholder = "搜索题目关键词",
  name = "search",
}: SearchInputProps) {
  return (
    <input
      defaultValue={defaultValue}
      name={name}
      placeholder={placeholder}
      className="field"
    />
  );
}
