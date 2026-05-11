import { useLocation } from "wouter";
import { useGetFeaturedJobs, useGetJobStats, useListCategories } from "@workspace/api-client-react";
import { Search, MapPin, Briefcase, TrendingUp, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Link } from "wouter";

export function Home() {
  const [, setLocation] = useLocation();
  const [keyword, setKeyword] = useState("");
  const [locationStr, setLocationStr] = useState("");
  
  const { data: featuredJobs, isLoading: isLoadingFeatured } = useGetFeaturedJobs();
  const { data: stats, isLoading: isLoadingStats } = useGetJobStats();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (locationStr) params.set("location", locationStr);
    setLocation(`/jobs?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary pt-24 pb-32 text-primary-foreground">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Find the work that <br className="hidden md:block"/> fuels your ambition
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            A curated collection of opportunities for professionals who demand more from their career.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-background rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 py-2">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input 
                placeholder="Job title, keyword, or company" 
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-foreground text-base h-12"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                data-testid="input-keyword"
              />
            </div>
            <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 py-2">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
              <Input 
                placeholder="City, state, or Remote" 
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-foreground text-base h-12"
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                data-testid="input-location"
              />
            </div>
            <Button type="submit" size="lg" className="h-16 px-8 rounded-xl text-lg font-semibold" data-testid="button-search">
              Search Jobs
            </Button>
          </form>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">
                {isLoadingStats ? <Skeleton className="h-9 w-20" /> : stats?.totalJobs || 0}
              </h3>
              <p className="text-muted-foreground mt-1 font-medium">Active Opportunities</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">Top Tier</h3>
              <p className="text-muted-foreground mt-1 font-medium">Vetted Companies</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-3xl font-bold text-foreground">Fast Track</h3>
              <p className="text-muted-foreground mt-1 font-medium">Direct Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">Explore Categories</h2>
              <p className="text-muted-foreground mt-2">Find your next role by industry</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isLoadingCategories ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))
            ) : categories?.map((category) => (
              <Link key={category.id} href={`/jobs?categoryId=${category.id}`} data-testid={`link-category-${category.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full border-muted">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center text-primary">
                      {/* Would render an icon component dynamically if we had a mapping, just a placeholder icon for now */}
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.jobCount || 0} jobs</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight">Featured Opportunities</h2>
              <p className="text-muted-foreground mt-2">Hand-picked roles from top companies</p>
            </div>
            <Link href="/jobs" data-testid="link-view-all-jobs">
              <Button variant="outline" className="hidden md:flex">View All Jobs</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatured ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))
            ) : featuredJobs?.length ? (
              featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p>No featured jobs available at the moment.</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/jobs">
              <Button variant="outline" className="w-full">View All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
