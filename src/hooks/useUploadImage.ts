import { ref } from "vue";
import { addPic } from '@/api/upload'
import { message } from "ant-design-vue";

// 自定义 Hook - 用于图片上传
export function useUploadImage() {
    const loading = ref(false);
    const imageList = ref<string[]>([]); // 存储图片的 URL 列表

    // 压缩图片函数
    const compressImage = (file: File): Promise<Blob> => {
        console.log("🚀 ~ compressImage ~ file:", file.name, file.size);
        return new Promise((resolve, reject) => {
            // 如果文件不是图片类型，直接返回原始文件
            if (!file.type.startsWith('image/')) {
                console.warn("🚀 ~ compressImage ~ 不是图片类型:", file.type);
                resolve(file);
                return;
            }

            const img = new Image();
            const reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target?.result as string;
            };
            reader.onerror = function (e) {
                console.error("🚀 ~ compressImage ~ 读取文件失败:", e);
                reject("FileReader错误");
            };

            reader.readAsDataURL(file);

            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 1024;
                const maxHeight = 1024;

                let width = img.width;
                let height = img.height;

                // 按比例缩放图片
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = true;
                (ctx as CanvasRenderingContext2D).imageSmoothingQuality = "high";
                (ctx as CanvasRenderingContext2D).drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            console.log("🚀 ~ compressImage ~ 压缩后大小:", blob.size);
                            resolve(blob);
                        } else {
                            console.error("🚀 ~ compressImage ~ 压缩失败");
                            reject("压缩失败");
                        }
                    },
                    "image/jpeg",
                    0.9
                );
            };

            img.onerror = function (e) {
                console.error("🚀 ~ compressImage ~ 图片加载失败:", e);
                reject("图片加载失败");
            };
        });
    };

    // 处理上传的图片
    const afterUpload = async (files: { file: File }[]): Promise<string[] | void> => {
        if (loading.value) return;
        loading.value = true;

        try {
            const compressedFiles: Blob[] = [];
            const filesToProcess = Array.isArray(files) ? files : [files];
            console.log("🚀 ~ afterUpload ~ 待处理文件数量:", filesToProcess.length);

            // 压缩图片
            for (const fileObj of filesToProcess) {
                if (!fileObj || !fileObj.file) {
                    console.error("🚀 ~ afterUpload ~ 无效的文件对象:", fileObj);
                    continue;
                }

                const file = fileObj.file;
                try {
                    const compressedFile = await compressImage(file);
                    compressedFiles.push(compressedFile);
                } catch (err) {
                    console.error("🚀 ~ afterUpload ~ 压缩文件失败:", err);
                    message.error(`压缩文件 ${file.name} 失败`);
                }
            }

            if (compressedFiles.length === 0) {
                message.error('没有可用的压缩文件');
                return [];
            }

            const formData = new FormData();
            compressedFiles.forEach((file, index) => {
                formData.append("files", file, `image_${index}.jpg`);
            });

            // 检查formData内容
            console.log("🚀 ~ afterUpload ~ FormData内容:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // 调用上传接口
            const { data } = await addPic(formData);
            if (!data || !data.urls || !data.urls.length) {
                throw new Error('服务器返回的数据无效');
            }

            imageList.value = [...imageList.value, ...data.urls];
            console.log("🚀 ~ afterUpload ~ 上传成功, 返回URL:", data.urls);
            message.success("上传成功");
            return data.urls;
        } catch (error) {
            console.error("🚀 ~ afterUpload ~ 上传失败:", error);
            message.error(isString(error) ? error as string : "上传失败");
            return [];
        } finally {
            loading.value = false;
        }
    };
    // 头像上传方法
    const uploadImg = async (file: File): Promise<string | undefined> => {
        console.log("🚀 ~ uploadImg ~ 开始上传文件:", file);

        if (loading.value) {
            message.warning("正在上传中, 请稍候...");
            return;
        }

        if (!file) {
            console.error("🚀 ~ uploadImg ~ 无效的文件对象");
            message.error("无效的文件对象");
            return;
        }

        try {
            loading.value = true;

            // 检查是否为File对象
            if (!(file instanceof File)) {
                console.error("🚀 ~ uploadImg ~ 不是File对象:", file);
                // 尝试从其他地方获取文件
                if (file && typeof file === 'object' && 'originFileObj' in file) {
                    file = (file as any).originFileObj;
                    if (!(file instanceof File)) {
                        throw new Error('无法获取有效的File对象');
                    }
                } else {
                    throw new Error('不是有效的File对象');
                }
            }

            console.log("🚀 ~ uploadImg ~ 压缩前文件大小:", file.size);

            // 压缩头像图片
            const compressedFile = await compressImage(file);
            console.log("🚀 ~ uploadImg ~ 压缩后文件大小:", compressedFile.size);

            const formData = new FormData();
            formData.append("files", compressedFile, file.name || 'image.jpg');

            // 检查FormData内容
            console.log("🚀 ~ uploadImg ~ FormData内容:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // 调用更新头像接口
            const response = await addPic(formData);
            console.log("🚀 ~ uploadImg ~ 上传接口返回:", response);

            if (!response || !response.data || !response.data.urls || !response.data.urls.length) {
                throw new Error('服务器返回的数据无效');
            }

            // 假设返回的 data.urls 里面包含了新上传的头像 URL
            const avatarUrl = response.data.urls[0];  // 获取头像的 URL
            console.log("🚀 ~ uploadImg ~ 头像 URL:", avatarUrl);

            message.success('上传成功');
            // 返回头像 URL，或者可以设置到其他地方
            return avatarUrl;
        } catch (error) {
            console.error("🚀 ~ uploadImg ~ 上传失败:", error);
            message.error(isString(error) ? error as string : "上传失败");
            return undefined;
        } finally {
            loading.value = false;
        }
    };
    // md编辑器上传图片
    const uploadImage = async (files: File[], callback: (arg0: string[]) => void) => {
        const results = []

        for (const file of files) {
            const url = await uploadImg(file)
            if (url) {
                results.push(url)
            }
        }

        callback(results)
    }
    return {
        loading,
        imageList,
        afterUpload,
        uploadImg,
        uploadImage
    };
}

// 判断是否为字符串
function isString(obj: any): obj is string {
    return typeof obj === 'string';
}
