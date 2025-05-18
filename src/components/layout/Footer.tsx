export default function Footer() {
    return (
        <footer className="border-t bg-background text-muted-foreground text-sm py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} GearBricks.vn – All rights reserved.</p>
                <p className="mt-1">Liên hệ: gearbricks5@gmail.com</p>
            </div>
        </footer>
    );
}
