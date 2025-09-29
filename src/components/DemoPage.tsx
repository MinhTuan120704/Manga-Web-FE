import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
interface DemoPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function DemoPage({ darkMode, onToggleDarkMode }: DemoPageProps) {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);

  return (
    <>
      <AppSidebar />

           <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          
                   <main className="flex-1">
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header with Dark Mode Toggle */}
            <div className="text-center space-y-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleDarkMode}
                  className="transition-all duration-300"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <h1 className="text-4xl font-bold text-foreground">
                Shadcn/UI Components Demo
              </h1>
              <p className="text-muted-foreground">
                Trang demo để kiểm tra các component shadcn/ui với theme manga
                và dark mode
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant={darkMode ? "default" : "secondary"}>
                  {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </Badge>
                <Badge variant="outline">Radix UI + Tailwind CSS</Badge>
              </div>
            </div>

            {/* Buttons Section */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Các loại button khác nhau với theme manga
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">🔥</Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Components */}
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>
                  Input, textarea, select và các form control khác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên</Label>
                    <Input id="name" placeholder="Nhập tên của bạn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tin nhắn</Label>
                  <Textarea
                    id="message"
                    placeholder="Nhập tin nhắn của bạn..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục Manga</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shounen">Shounen</SelectItem>
                      <SelectItem value="shoujo">Shoujo</SelectItem>
                      <SelectItem value="seinen">Seinen</SelectItem>
                      <SelectItem value="josei">Josei</SelectItem>
                      <SelectItem value="kodomomuke">Kodomomuke</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Components */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Components</CardTitle>
                <CardDescription>
                  Checkbox, switch và các component tương tác khác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={checkboxValue}
                    onCheckedChange={(checked) =>
                      setCheckboxValue(checked === true)
                    }
                  />
                  <Label htmlFor="terms">
                    Tôi đồng ý với điều khoản sử dụng
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                  />
                  <Label htmlFor="notifications">
                    Nhận thông báo manga mới
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Genre Badges</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Action</Badge>
                    <Badge variant="secondary">Romance</Badge>
                    <Badge variant="destructive">Horror</Badge>
                    <Badge variant="outline">Comedy</Badge>
                    <Badge>Fantasy</Badge>
                    <Badge variant="secondary">Slice of Life</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatar and User Components */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar & User Components</CardTitle>
                <CardDescription>
                  Avatar component với các kích cỡ khác nhau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@user1"
                      />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Minh Tuan</h3>
                      <p className="text-sm text-muted-foreground">
                        Manga Creator
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        Premium
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Anime Fan</h3>
                      <p className="text-sm text-muted-foreground">Reader</p>
                      <Badge variant="outline" className="mt-1">
                        Free
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Manga Reader</h3>
                      <p className="text-sm text-muted-foreground">
                        Translator
                      </p>
                      <Badge className="mt-1">Pro</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Colors Test */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Colors Test</CardTitle>
                <CardDescription>
                  Kiểm tra color palette manga theme -{" "}
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-12 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        Primary
                      </span>
                    </div>
                    <p className="text-sm text-center">Primary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-secondary rounded flex items-center justify-center">
                      <span className="text-secondary-foreground font-medium">
                        Secondary
                      </span>
                    </div>
                    <p className="text-sm text-center">Secondary</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">
                        Muted
                      </span>
                    </div>
                    <p className="text-sm text-center">Muted</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-accent rounded flex items-center justify-center">
                      <span className="text-accent-foreground font-medium">
                        Accent
                      </span>
                    </div>
                    <p className="text-sm text-center">Accent</p>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Current Theme Info:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>
                      Mode:{" "}
                      <Badge variant="outline">
                        {darkMode ? "Dark" : "Light"}
                      </Badge>
                    </span>
                    <span>
                      Color Space: <Badge variant="outline">OKLCH</Badge>
                    </span>
                    <span>
                      Base Hue: <Badge variant="outline">240° (Blue)</Badge>
                    </span>
                    <span>
                      Framework: <Badge variant="outline">Radix UI</Badge>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            <div className="text-center p-6 border border-green-500/20 bg-green-500/10 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                🎉 Setup hoàn tất!
              </h3>
              <p className="text-muted-foreground">
                Tất cả component đã hoạt động tốt! Shadcn/UI (Radix UI) đã được
                setup đúng cách với theme manga.
              </p>
            </div>
          </div>
        </div>
      </main>

        </div>
      </SidebarInset>
     
    </>
  );
}
