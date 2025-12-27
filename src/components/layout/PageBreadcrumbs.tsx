import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbsProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const PageBreadcrumbs = ({ breadcrumbs = [] }: PageBreadcrumbsProps) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <div className="px-4 py-2 border-b bg-background overflow-x-auto">
      <div className="max-w-full">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};
