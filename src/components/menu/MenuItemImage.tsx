import FoodImage, { ImageMood } from "@/components/ui/FoodImage";
import { getMenuImage } from "@/lib/menu-images";
import { MenuItem } from "@/lib/types";

interface MenuItemImageProps {
  item: Pick<MenuItem, "id" | "name" | "datePick" | "protein">;
  mood: ImageMood;
  ratio?: "square" | "card" | "portrait" | "wide";
  /** Category name, used to make the alt text specific. */
  context?: string;
  icon?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * The one image component for menu dishes. It looks up the dish's photo from
 * public/menu/ (via the generated manifest) so a newly added photo appears
 * everywhere that dish is shown, already fitted to each frame.
 */
export default function MenuItemImage({
  item,
  mood,
  ratio = "card",
  context,
  icon,
  className,
  sizes,
  priority,
}: MenuItemImageProps) {
  const photo = getMenuImage(item.id);
  return (
    <FoodImage
      mood={mood}
      ratio={ratio}
      icon={icon ?? (item.datePick ? "❤️" : item.protein ? "💪" : "🍽")}
      className={className}
      src={photo?.src}
      focus={photo?.focus}
      alt={context ? `${item.name} — ${context} at LOVBITES, Hirapur, Dhanbad` : `${item.name} at LOVBITES`}
      sizes={sizes}
      priority={priority}
    />
  );
}
