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

    async updateProfile(id, data) {
        try {
            const emailExist = await this.userRepository.findByEmail(data.email);
            if (emailExist && data.email == emailExist.email) throw new EmailAlreadyExists(`Email ${data.email} already exists`);

            const updatedUser = await this.userRepository.update(id, data);

            const { passwordHash, ...user } = updatedUser;

            return user;
        } catch (error) {
            throw error;
        }
    }
}