import { User } from '../api/models';
import { SafeResourceUrl } from '@angular/platform-browser';

export default interface UserStripe {
    user: User;
    stripetotal: number;
    profilePicture?: SafeResourceUrl;
}