import { Sparkles, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyState = () => {
  const examples = [
    "Tôi muốn đọc truyện về ninja với sức mạnh siêu nhiên và có yếu tố tình cánh",
    "Tìm truyện fantasy có trường học ma thuật, rồng và hài hước",
    "Truyện tâm lý tối tăm có yếu tố bí ẩn và nhiều tình tiết bất ngờ",
    "Slice of life về nấu ăn với câu chuyện ấm áp",
    "Shounen phiêu lưu với chủ đề tình bạn và trận chiến hoành tráng",
  ];

  return (
    <div className="w-full space-y-6">
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Sẵn sàng khám phá truyện mới?
            </h3>
            <p className="text-muted-foreground max-w-md">
              Mô tả loại truyện bạn muốn đọc và AI sẽ đề xuất những câu chuyện
              phù hợp nhất
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Example suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">
            Gợi ý mô tả:
          </h4>
        </div>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="py-3 px-4">
                <p className="text-sm text-muted-foreground italic">
                  "{example}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
