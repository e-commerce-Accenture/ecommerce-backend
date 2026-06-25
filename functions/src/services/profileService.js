export class ProfileService {
    constructor(userRepository, profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    async getProfile(id) {
        try {
            const findedUser = await this.userRepository.findById(id);
            const findedProfile = await this.profileRepository.findProfileByUserId(id)

            const { passwordHash, ...user } = findedUser;
            const {userId, ...profile} = findedProfile;

            const userProfile = {
                ...user,
                ...profile
            }

            return userProfile;

        } catch (error) {
            throw error;
        }
    }

    async updateProfile(id, userData, addressData) {
        try {
            const emailExist = await this.userRepository.findByEmail(userData.email);
            if (emailExist && userData.email == emailExist.email) throw new EmailAlreadyExists(`Email ${data.email} already exists`);
            
            const updatedUser = await this.userRepository.update(id, userData);
            const updatedProfile = await this.profileRepository.update(id, addressData);
            
            const { passwordHash, ...user } = updatedUser;
            const {userId, ...profile} = updatedProfile;

            const userProfileUpdated = {
                ...user,
                ...profile
            };

            return userProfileUpdated;

        } catch (error) {
            throw error;
        }
    }
}