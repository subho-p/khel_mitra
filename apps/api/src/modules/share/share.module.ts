import { Global, Module } from '@nestjs/common';
import { SocketRegistryService } from './socket-registry.service';
import { JobQueueService } from './job-queue.service';

@Global()
@Module({
    providers: [SocketRegistryService, JobQueueService],
    exports: [SocketRegistryService, JobQueueService],
})
export class ShareModule {}
