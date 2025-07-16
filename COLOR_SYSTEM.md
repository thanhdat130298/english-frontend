# Hệ thống màu sắc VocabVault

## Tổng quan

Hệ thống màu sắc của VocabVault được thiết kế để dễ dàng quản lý và thay đổi. Tất cả màu sắc được định nghĩa trong file `src/styles/_variables.scss` và được sử dụng thông qua CSS variables.

## Cách hoạt động

### 1. Định nghĩa màu sắc
Tất cả màu sắc được định nghĩa trong `src/styles/_variables.scss`:

```scss
// Light Theme
$light-theme: (
  primary: #80EE98,      // Light green - màu chính
  secondary: #46DFB1,    // Teal green - màu phụ
  accent: #09D1C7,       // Cyan - màu nhấn
  success: #80EE98,      // Màu thành công
  info: #15919B,         // Màu thông tin
  dark: #0C6478,         // Màu tối
  white: #ffffff,        // Màu trắng
  text: #213A58,         // Màu chữ
  background: #fff       // Màu nền
);

// Dark Theme
$dark-theme: (
  primary: #80EE98,
  secondary: #46DFB1,
  accent: #09D1C7,
  success: #80EE98,
  info: #15919B,
  dark: #fff,
  white: #0C6478,
  text: #fff,
  background: #0C6478
);
```

### 2. CSS Variables
Màu sắc được chuyển đổi thành CSS variables:

```scss
:root {
  --color-primary: #80EE98;
  --color-secondary: #46DFB1;
  --color-accent: #09D1C7;
  --color-success: #80EE98;
  --color-info: #15919B;
  --color-dark: #0C6478;
  --color-white: #ffffff;
  --color-text: #213A58;
  --color-background: #fff;
}

.dark {
  --color-primary: #80EE98;
  --color-secondary: #46DFB1;
  --color-accent: #09D1C7;
  --color-success: #80EE98;
  --color-info: #15919B;
  --color-dark: #fff;
  --color-white: #0C6478;
  --color-text: #fff;
  --color-background: #0C6478;
}
```

### 3. Utility Classes
Các utility classes được tạo trong `src/styles/main.scss`:

```scss
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }
.text-dark { color: var(--color-dark); }
.text-white { color: var(--color-white); }

.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-accent { background-color: var(--color-accent); }
.bg-dark { background-color: var(--color-dark); }
.bg-white { background-color: var(--color-white); }

.border-primary { border-color: var(--color-primary); }
.border-secondary { border-color: var(--color-secondary); }
.border-accent { border-color: var(--color-accent); }
.border-dark { border-color: var(--color-dark); }
```

## Cách sử dụng

### Trong Components
Thay vì sử dụng hardcoded colors, hãy sử dụng CSS classes:

```tsx
// ❌ Không nên
<div style={{ backgroundColor: '#80EE98' }}>Content</div>

// ✅ Nên sử dụng
<div className="bg-primary">Content</div>
```

### Thay đổi màu sắc
Để thay đổi màu sắc, chỉ cần cập nhật file `src/styles/_variables.scss`:

```scss
// Thay đổi màu primary
$light-theme: (
  primary: #FF6B6B,  // Màu mới
  // ... các màu khác
);
```

Tất cả components sẽ tự động áp dụng màu mới mà không cần sửa từng file.

## Lợi ích

1. **Dễ bảo trì**: Chỉ cần sửa một file để thay đổi toàn bộ màu sắc
2. **Nhất quán**: Tất cả components sử dụng cùng một bộ màu
3. **Hỗ trợ theme**: Dễ dàng chuyển đổi giữa light/dark theme
4. **Performance**: CSS variables được tối ưu hóa tốt hơn inline styles
5. **Type safety**: TypeScript có thể kiểm tra các class names

## Best Practices

1. **Luôn sử dụng CSS classes** thay vì inline styles
2. **Import SCSS file** trong mỗi component: `import '../styles/main.scss'`
3. **Sử dụng semantic class names**: `bg-primary`, `text-dark`, etc.
4. **Tránh hardcoded colors** trong components
5. **Test cả light và dark theme** khi thay đổi màu sắc 