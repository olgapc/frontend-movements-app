import { User } from 'src/app/users/models/user';

export class UserAssignment {

    id: number;
    createAt: string;
    comment: string;
    startDate: string;
    endDate: string;
    assignedBy: User;
    isClaimed: boolean;
    claimDate: string;
    isViewedByUser: boolean;
    viewDate: string;
    
}
