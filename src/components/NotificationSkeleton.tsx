import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

const NotificationSkeleton = () => {
  // array of 5 items
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className=" space-y-4">
      <Card>
        <CardHeader className=" border-b">
          <div className=" flex items-center justify-between">
            <CardTitle>Notification</CardTitle>
            <Skeleton className=" h04 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p=0">
          <ScrollArea className=" h-[calc(100vh-12rem)]">
            {skeletonItems.map((index) => (
              <div key={index} className=" flex items-start gap-4 p-4 border-b">
                <Skeleton className=" size-10 rounded-full" />
                <div className=" flex-1 space-y-2">
                  <div className=" flex items-center gap-2">
                    <Skeleton className="size-4" />
                    {/* as */}
                    <Skeleton className="h-4 w-40" />
                    {/* asdas */}
                  </div>
                  <div className=" pl-6 space-y-2">
                    <Skeleton className=" h-20 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSkeleton;
