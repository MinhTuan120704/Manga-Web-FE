import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const goBack = () => {
    navigate(-1);
  };
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Coffee className="w-32 h-32" />
        </EmptyMedia>
        <EmptyTitle>404 Không tìm thấy...</EmptyTitle>
        <EmptyDescription>
          Trang bạn đang cố truy cập không tồn tại... <br />
          Quay về trang chủ?
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={goHome}>Về trang chủ</Button>
          <Button variant="outline" onClick={goBack}>
            Quay lại trang trước
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
