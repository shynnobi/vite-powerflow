import { type ReactElement } from 'react';

interface GreetingProps {
	name: string;
}

export function Greeting({ name }: GreetingProps): ReactElement {
	return (
		<div className="greeting">
			<h2>Hello, {name}!</h2>
			<p>Welcome to our application using path aliases.</p>
		</div>
	);
}
