import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useListJobs, useListCategories, ListJobsType } from "@workspace/api-client-react";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Jobs() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, setLocation] = useLocation();

  const keywordParam = searchParams.get("keyword") || "";
  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("categoryId");
  const typeParam = searchParams.get("type") as ListJobsType | undefined;
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [keyword, setKeyword] = useState(keywordParam);
  const [locationStr, setLocationStr] = useState(locationParam);
  const [categoryId, setCategoryId] = useState<string>(categoryParam || "all");
  const [jobType, setJobType] = useState<string>(typeParam || "all");

  const { data: categories } = useListCategories();

  const { data: jobList, isLoading } = useListJobs({
    keyword: keywordParam || undefined,
    location: locationParam || undefined,
    categoryId: categoryParam ? parseInt(categoryParam, 10) : undefined,
    type: typeParam || undefined,
    page: pageParam,
    limit: 12
  }, { query: { queryKey: ["jobs", keywordParam, locationParam, categoryParam, typeParam, pageParam] } });

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (locationStr) params.set("location", locationStr);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    if (jobType && jobType !== "all") params.set("type", jobType);
    params.set("page", "1");
    setLocation(`/jobs?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchString);
    params.set("page", newPage.toString());
    setLocation(`/jobs?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Job title, keyword" 
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="City, state, remote" 
            className="pl-9"
            value={locationStr}
            onChange={(e) => setLocationStr(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 border-r pr-6 space-y-6 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
          <div>
            <h2 className="font-display font-bold text-xl mb-6">Filters</h2>
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display font-bold text-3xl">
              {isLoading ? <Skeleton className="h-9 w-48" /> : (
                <>{jobList?.total || 0} Jobs Found</>
              )}
            </h1>
            
            {/* Mobile Filter Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : jobList?.jobs.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-display font-semibold text-xl mb-2">No jobs found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any jobs matching your current filters. Try broadening your search.
              </p>
              <Button variant="outline" onClick={() => {
                setKeyword(""); setLocationStr(""); setCategoryId("all"); setJobType("all");
                setLocation("/jobs");
              }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobList?.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {jobList && jobList.total > jobList.limit && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePageChange(jobList.page - 1)}
                    disabled={jobList.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground font-medium w-32 text-center">
                    Page {jobList.page} of {Math.ceil(jobList.total / jobList.limit)}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePageChange(jobList.page + 1)}
                    disabled={jobList.page >= Math.ceil(jobList.total / jobList.limit)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
