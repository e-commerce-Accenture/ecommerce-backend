export class ProfileService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getProfile(id) {
        try {
            const user = await this.userRepository.findById(id);
            const { passwordHash, ...profile } = user;

            return profile;

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