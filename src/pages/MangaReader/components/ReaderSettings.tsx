import { X, Book, ArrowRight, Maximize, Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReaderSettings as ReaderSettingsType } from "../MangaReader";

interface ReaderSettingsProps {
  settings: ReaderSettingsType;
  onUpdateSettings: (settings: Partial<ReaderSettingsType>) => void;
  onClose: () => void;
}

export function ReaderSettings({
  settings,
  onUpdateSettings,
  onClose,
}: ReaderSettingsProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end animate-in fade-in">
      <Card className="w-full max-w-md h-full rounded-none border-l shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Reader Settings</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Reading Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="reading-mode">Reading Mode</Label>
            </div>
            <Select
              value={settings.readingMode}
              onValueChange={(value) =>
                onUpdateSettings({
                  readingMode: value as ReaderSettingsType["readingMode"],
                })
              }
            >
              <SelectTrigger id="reading-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Page</SelectItem>
                <SelectItem value="double">Double Page</SelectItem>
                <SelectItem value="long-strip">Long Strip (Webtoon)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {settings.readingMode === "single" && "Read one page at a time"}
              {settings.readingMode === "double" &&
                "Read two pages side by side"}
              {settings.readingMode === "long-strip" &&
                "Scroll vertically through all pages"}
            </p>
          </div>

          {/* Reading Direction */}
          {settings.readingMode !== "long-strip" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reading-direction">Reading Direction</Label>
              </div>
              <Select
                value={settings.readingDirection}
                onValueChange={(value) =>
                  onUpdateSettings({
                    readingDirection:
                      value as ReaderSettingsType["readingDirection"],
                  })
                }
              >
                <SelectTrigger id="reading-direction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ltr">Left to Right</SelectItem>
                  <SelectItem value="rtl">Right to Left (Manga)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {settings.readingDirection === "ltr"
                  ? "Western comics style"
                  : "Traditional manga style"}
              </p>
            </div>
          )}

          {/* Double Page Offset */}
          {settings.readingMode === "double" && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="double-page-offset" className="cursor-pointer">
                  Offset First Page
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display first page alone (for cover pages)
                </p>
              </div>
              <Switch
                id="double-page-offset"
                checked={settings.doublePageOffset}
                onCheckedChange={(checked) =>
                  onUpdateSettings({ doublePageOffset: checked })
                }
              />
            </div>
          )}

          {/* Fit Mode */}
          {settings.readingMode !== "long-strip" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="fit-mode">Fit Mode</Label>
              </div>
              <Select
                value={settings.fitMode}
                onValueChange={(value) =>
                  onUpdateSettings({
                    fitMode: value as ReaderSettingsType["fitMode"],
                  })
                }
              >
                <SelectTrigger id="fit-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fit-width">Fit Width</SelectItem>
                  <SelectItem value="fit-height">Fit Height</SelectItem>
                  <SelectItem value="original">Original Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Background Color */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="background-color">Background Color</Label>
            </div>
            <Select
              value={settings.backgroundColor}
              onValueChange={(value) =>
                onUpdateSettings({
                  backgroundColor:
                    value as ReaderSettingsType["backgroundColor"],
                })
              }
            >
              <SelectTrigger id="background-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="black">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Page Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="show-page-number" className="cursor-pointer">
                Show Page Number
              </Label>
            </div>
            <Switch
              id="show-page-number"
              checked={settings.showPageNumber}
              onCheckedChange={(checked) =>
                onUpdateSettings({ showPageNumber: checked })
              }
            />
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="pt-4 border-t space-y-2">
            <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Next/Previous Page:</span>
                <span className="font-mono">← →</span>
              </div>
              <div className="flex justify-between">
                <span>Scroll (Long Strip):</span>
                <span className="font-mono">↑ ↓</span>
              </div>
              <div className="flex justify-between">
                <span>First/Last Page:</span>
                <span className="font-mono">Home / End</span>
              </div>
              <div className="flex justify-between">
                <span>Toggle Settings:</span>
                <span className="font-mono">S</span>
              </div>
              <div className="flex justify-between">
                <span>Toggle Navigation:</span>
                <span className="font-mono">N</span>
              </div>
              <div className="flex justify-between">
                <span>Close Panel:</span>
                <span className="font-mono">Esc</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
