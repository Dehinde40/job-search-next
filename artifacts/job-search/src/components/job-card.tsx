import { Link } from "wouter";
import { Job } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function JobCard({ job }: { job: Job }) {
  const isNew = new Date(job.postedAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000;
  
  return (
    <Link href={`/jobs/${job.id}`} data-testid={`link-job-${job.id}`}>
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg border bg-background flex items-center justify-center overflow-hidden shrink-0">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                  {job.company}
                </p>
              </div>
            </div>
            {isNew && <Badge variant="secondary" className="shrink-0 bg-secondary/20 text-secondary-foreground hover:bg-secondary/20">New</Badge>}
          </div>
        </CardHeader>
        <CardContent className="pb-4 flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-muted-foreground font-normal flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground font-normal flex items-center gap-1 capitalize">
              <Clock className="h-3 w-3" />
              {job.type.replace("-", " ")}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground font-normal flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {job.salary}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground mt-auto border-t p-4 pb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
          </div>
          {job.applicants != null && (
            <div className="font-medium">
              {job.applicants} applicants
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
