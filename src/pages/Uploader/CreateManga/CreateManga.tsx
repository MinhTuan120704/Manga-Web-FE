import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { mangaService } from "@/services/manga.service";
import { genreService } from "@/services/genre.service";
import { ArrowLeft, Upload, BookOpen, Loader2, X, Search, AlertCircle } from "lucide-react";
import type { Genre, CreateMangaRequest } from "@/types";

// Validation errors type
interface ValidationErrors {
  title?: string;
  description?: string;
  author?: string;
  genres?: string;
  coverImage?: string;
  general?: string;
}

export function CreateManga() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>("");
  
  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Genre search states
  const [genreSearch, setGenreSearch] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const genreInputRef = useRef<HTMLInputElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    artist: "",
    status: "ongoing" as "ongoing" | "completed" | "hiatus",
    coverImage: null as File | null, 
  });

  // Fetch genres khi component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await genreService.getGenres();
        console.log("📦 Genres loaded:", response);
        setGenres(response || []);
      } catch (error) {
        console.error("❌ Error loading genres:", error);
        toast.error("Không thể tải danh sách thể loại");
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node) &&
        genreInputRef.current &&
        !genreInputRef.current.contains(event.target as Node)
      ) {
        setShowGenreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error khi user nhập
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, coverImage: "Kích thước ảnh không được vượt quá 5MB" }));
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, coverImage: "Vui lòng chọn file ảnh hợp lệ" }));
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      setFormData((prev) => ({ ...prev, coverImage: file }));
      setErrors((prev) => ({ ...prev, coverImage: undefined }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setFormData((prev) => ({ ...prev, coverImage: null })); 
    setCoverPreview("");
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
  };

  // Filter genres - Hiển thị tất cả nếu search rỗng
  const filteredGenres = genres.filter((genre) => {
    const matchesSearch = genreSearch.trim() === "" || 
      genre.name.toLowerCase().includes(genreSearch.toLowerCase());
    const notSelected = !selectedGenres.some((selected) => selected._id === genre._id);
    return matchesSearch && notSelected;
  });

  const handleGenreSelect = (genre: Genre) => {
    if (selectedGenres.length >= 5) {
      toast.error("Chỉ được chọn tối đa 5 thể loại");
      return;
    }
    setSelectedGenres((prev) => [...prev, genre]);
    setGenreSearch("");
    setShowGenreDropdown(false);
    // Clear genre error
    setErrors((prev) => ({ ...prev, genres: undefined }));
    // Focus lại input để tiếp tục chọn
    setTimeout(() => {
      genreInputRef.current?.focus();
    }, 100);
  };

  const handleGenreRemove = (genreId: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g._id !== genreId));
  };

  // ✅ FIXED: Chỉ validate title
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Title validation - BẮT BUỘC
    if (!formData.title.trim()) {
      newErrors.title = "Tên truyện là bắt buộc";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Tên truyện phải có ít nhất 3 ký tự";
    }

    setErrors(newErrors);

    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED: Tự động điền "Đang cập nhật" nếu để trống
      const description = formData.description.trim() || "Đang cập nhật";
      const author = formData.author.trim() || "Đang cập nhật";
      const artist = formData.artist.trim() || author;

      const requestData: CreateMangaRequest = {
        title: formData.title.trim(),
        description: description,
        author: author,
        artist: artist,
        status: formData.status,
        genres: selectedGenres.map((g) => g._id),
        coverImage: formData.coverImage!,
      };

      console.log("📤 Submitting manga:", {
        ...requestData,
        coverImage: requestData.coverImage || null
      });

      const response = await mangaService.createManga(requestData);
      console.log("✅ Response:", response);
      
      toast.success("Tạo truyện mới thành công!");
      navigate(`/uploader/manga/${response._id || ""}`);
    } catch (error: unknown) { 
      console.error("❌ Error creating manga:", error);
      
      // Parse error message từ response
      let errorMessage = "Có lỗi xảy ra khi tạo truyện";
      
      // Type guard cho axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              message?: string; 
              errors?: Record<string, string> 
            } 
          };
          message?: string;
        };
        
        if (axiosError.response) {
          const data = axiosError.response;
          
          // Nếu có message từ API
          if (data.message) {
            errorMessage = data.message;
          }
          
          // Nếu có validation errors từ API
          if (data.errors) {
            const apiErrors: ValidationErrors = {};
            Object.keys(data.errors).forEach((key) => {
              apiErrors[key as keyof ValidationErrors] = data.errors![key];
            });
            setErrors(apiErrors);
          }
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Set general error
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ongoing: "Đang tiến hành",
      completed: "Hoàn thành",
      hiatus: "Tạm ngưng",
    };
    return labels[status] || status;
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/uploader")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Dashboard
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tạo truyện mới</h1>
            <p className="text-muted-foreground mt-1">
              Thêm một bộ truyện mới vào kho của bạn
            </p>
          </div>
        </div>
      </div>

      {/* General Error Alert */}
      {errors.general && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Điền thông tin chi tiết về truyện của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Tên truyện - BẮT BUỘC */}
              <div className="space-y-2" id="title">
                <Label htmlFor="title-input" className={errors.title ? "text-destructive" : ""}>
                  Tên truyện <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title-input"
                  placeholder="VD: One Piece, Naruto, Demon Slayer..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={loading}
                  maxLength={200}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/200 ký tự
                </p>
              </div>

              {/* Mô tả - TỰ ĐỘNG "Đang cập nhật" */}
              <div className="space-y-2" id="description">
                <Label htmlFor="description-input">
                  Mô tả
                  <span className="text-muted-foreground text-xs ml-2">
                    (Để trống sẽ tự động điền "Đang cập nhật")
                  </span>
                </Label>
                <Textarea
                  id="description-input"
                  placeholder="Nhập mô tả về nội dung truyện, cốt truyện, nhân vật..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  disabled={loading}
                  rows={6}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/2000 ký tự
                </p>
              </div>

              {/* Tác giả & Họa sĩ - TỰ ĐỘNG "Đang cập nhật" */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2" id="author">
                  <Label htmlFor="author-input">
                    Tác giả
                    <span className="text-muted-foreground text-xs ml-2">
                      (Để trống sẽ tự động điền "Đang cập nhật")
                    </span>
                  </Label>
                  <Input
                    id="author-input"
                    placeholder="Nhập tên tác giả"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    disabled={loading}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">
                    Họa sĩ
                    <span className="text-muted-foreground text-xs ml-2">
                      (Mặc định bằng tác giả)
                    </span>
                  </Label>
                  <Input
                    id="artist"
                    placeholder="Nhập tên họa sĩ"
                    value={formData.artist}
                    onChange={(e) => handleInputChange("artist", e.target.value)}
                    disabled={loading}
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Trạng thái - BẮT BUỘC (có default) */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Trạng thái phát hành <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ongoing" | "completed" | "hiatus") => 
                    handleInputChange("status", value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">
                      {getStatusLabel("ongoing")}
                    </SelectItem>
                    <SelectItem value="completed">
                      {getStatusLabel("completed")}
                    </SelectItem>
                    <SelectItem value="hiatus">
                      {getStatusLabel("hiatus")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ảnh bìa - KHÔNG BẮT BUỘC */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh bìa</CardTitle>
              <CardDescription>
                Upload ảnh bìa cho truyện (tùy chọn, tỷ lệ khuyến nghị 2:3, tối đa 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" id="coverImage">
                {!coverPreview ? (
                  <div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        disabled={loading}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        disabled={loading}
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.coverImage && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                        <AlertCircle className="h-3 w-3" />
                        {errors.coverImage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-48 h-72 border-2 border-border rounded-lg overflow-hidden group">
                      <img
                        src={coverPreview}
                        alt="Preview cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveCover}
                          disabled={loading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Xóa ảnh
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.coverImage?.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thể loại - KHÔNG BẮT BUỘC */}
          <Card>
            <CardHeader>
              <CardTitle>Thể loại</CardTitle>
              <CardDescription>
                Tìm kiếm và chọn các thể loại phù hợp (tùy chọn, tối đa 5)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingGenres ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {/* Search Input */}
                  <div className="relative" id="genres">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={genreInputRef}
                        type="text"
                        placeholder="Click để xem danh sách hoặc nhập để tìm kiếm..."
                        value={genreSearch}
                        onChange={(e) => {
                          setGenreSearch(e.target.value);
                          setShowGenreDropdown(true);
                        }}
                        onFocus={() => setShowGenreDropdown(true)}
                        disabled={loading || selectedGenres.length >= 5}
                        className="pl-10"
                      />
                    </div>

                    {/* Dropdown */}
                    {showGenreDropdown && filteredGenres.length > 0 && (
                      <div
                        ref={genreDropdownRef}
                        className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredGenres.map((genre) => (
                          <button
                            key={genre._id}
                            type="button"
                            onClick={() => handleGenreSelect(genre)}
                            className="w-full px-4 py-2.5 text-left hover:bg-accent transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium">{genre.name}</span>
                            <div className="flex items-center gap-2">
                              {genre.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {genre.description}
                                </span>
                              )}
                              {genre.mangaCount !== undefined && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {genre.mangaCount} truyện
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results */}
                    {showGenreDropdown && genreSearch.trim() !== "" && filteredGenres.length === 0 && (
                      <div
                        ref={genreDropdownRef}
                        className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground"
                      >
                        Không tìm thấy thể loại "{genreSearch}"
                      </div>
                    )}
                  </div>

                  {/* Selected Genres */}
                  {selectedGenres.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Đã chọn ({selectedGenres.length}/5):
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedGenres.map((genre) => (
                          <Badge
                            key={genre._id}
                            variant="secondary"
                            className="pl-3 pr-2 py-1.5 text-sm"
                          >
                            {genre.name}
                            <button
                              type="button"
                              onClick={() => handleGenreRemove(genre._id)}
                              disabled={loading}
                              className="ml-2 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Helper text */}
                  <p className="text-xs text-muted-foreground">
                    {selectedGenres.length === 0
                      ? "Click vào ô tìm kiếm để xem tất cả thể loại"
                      : selectedGenres.length >= 5
                      ? "Đã đạt giới hạn 5 thể loại"
                      : `Còn có thể chọn thêm ${5 - selectedGenres.length} thể loại`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/uploader")}
              disabled={loading}
              className="order-2 sm:order-1"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="order-1 sm:order-2"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Đang tạo..." : "Tạo truyện"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}