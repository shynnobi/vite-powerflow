export interface Post {
	id: number;
	title: string;
	body: string;
}

export type CreatePostInput = Omit<Post, 'id'>;
