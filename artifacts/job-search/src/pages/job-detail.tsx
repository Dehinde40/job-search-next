import { useParams, Link } from "wouter";
import { useGetJob, getGetJobQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building2, ChevronLeft, ArrowRight, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function JobDetail() {
  const params = useParams();
  const jobId = parseInt(params.id || "0", 10);
  const { toast } = useToast();

  const { data: job, isLoading, error } = useGetJob(jobId, { 
    query: { 
      enabled: !!jobId,
      queryKey: getGetJobQueryKey(jobId)
    } 
  });

  const handleApply = () => {
    toast({
      title: "Application Submitted",
      description: `You've successfully applied to ${job?.company}. Good luck!`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="flex gap-6 mb-8">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">This job posting may have been removed or doesn't exist.</p>
        <Link href="/jobs">
          <Button>Browse All Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-14rem)]">
      {/* Header Banner */}
      <div className="bg-background border-b pt-12 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to jobs
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl border shadow-sm bg-background flex items-center justify-center overflow-hidden shrink-0">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{job.title}</h1>
                <div className="text-xl font-medium text-muted-foreground mb-4">{job.company}</div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-3 py-1 font-medium flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {job.location}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 font-medium flex items-center gap-1.5 capitalize">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {job.type.replace("-", " ")}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 font-medium flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.salary}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              <Button size="lg" className="flex-1 md:w-full font-semibold text-base" onClick={handleApply}>
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="flex-1 md:w-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold mb-6">About the role</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
            
            {job.requirements && (
              <section>
                <h2 className="font-display text-2xl font-bold mb-6">Requirements</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </section>
            )}
            
            <div className="pt-8 border-t">
              <Button size="lg" className="w-full md:w-auto px-12 font-semibold text-base" onClick={handleApply}>
                Apply for this role
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Posted</div>
                  <div className="font-medium">{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <div className="font-medium">{job.category?.name || "Uncategorized"}</div>
                </div>
                {job.applicants != null && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Applicants</div>
                    <div className="font-medium">{job.applicants} people applied</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 text-center">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">About {job.company}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our team to build amazing products. We value culture, impact, and growth.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto">View company profile</Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
