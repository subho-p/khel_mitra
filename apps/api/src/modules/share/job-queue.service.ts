import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

type JobFunction = () => Promise<void>;

interface JobMetadata {
    id: string;
    priority: number;
    attempts: number;
    maxRetries: number;
    fun: JobFunction;
}

@Injectable()
export class JobQueueService {
    private readonly logger = new Logger(JobQueueService.name);
    private isProcessing = false;

    private queue: JobMetadata[] = [];

    async addJob(
        fun: JobFunction,
        options?: {
            priority?: number;
            maxRetries?: number;
        },
    ) {
        const job: JobMetadata = {
            id: randomUUID(),
            priority: options?.priority ?? 0,
            attempts: 0,
            maxRetries: options?.maxRetries ?? 0,
            fun,
        };

        this.insertByPriority(job);
        this.logger.debug(`Added job ${job.id} with priority ${options?.priority}`);

        await this.processQueue();

        return job.id;
    }

    private insertByPriority(job: JobMetadata) {
        const index = this.queue.findIndex((j) => j.priority > job.priority);
        if (index === -1) {
            this.queue.push(job);
        } else {
            this.queue.splice(index, 0, job);
        }
    }

    private async processQueue() {
        if (this.isProcessing) return;

        this.isProcessing = true;

        try {
            while (this.queue.length > 0) {
                const job = this.queue.shift();
                if (!job) continue;

                this.logger.debug(`Processing job ${job.id} with priority ${job.priority}`);

                try {
                    job.attempts += 1;
                    await job.fun();
                } catch (e) {
                    this.logger.error(`Job ${job.id} failed with error: ${e.message}`);
                    if (job.attempts < job.maxRetries) {
                        this.insertByPriority({
                            ...job,
                            attempts: job.attempts + 1,
                        });
                    }
                }
            }
        } finally {
            this.isProcessing = false;
            this.logger.debug("Job Processing Done");
        }
    }
}
