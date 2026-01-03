import Link from "next/link";
import { Button } from "@/components/ui/button";

type BackButtonProps = {
  href: string;
  label: string;
};

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Link href={href} className="w-full">
      <Button variant="link" size="sm" className="w-full font-normal">
        {label}
      </Button>
    </Link>
  );
};
