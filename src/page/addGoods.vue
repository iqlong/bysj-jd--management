<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px">
            <el-col :span="14" :offset="4">
                <header class="form_header">选择商品种类</header>
                <el-form
                    :rules="productRules"
                    :model="categoryForm"
                    ref="categoryForm"
                    label-width="110px"
                    class="form"
                >
                    <el-row class="category_select">
                        <el-form-item
                            prop="categorySelect"
                            label="商品种类"
							required
                        >
                            <el-select
                                v-model="categoryForm.categorySelect"
                                :placeholder="selectValue.label"
                                style="width: 100%"
                                filterable
                            >
                                <el-option
                                    v-for="item in categoryForm.categoryList"
                                    :key="item['category_id']"
                                    :label="item['category_name']"
                                    :value="item['category_id']"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row
                        class="add_category_row"
                        :class="showAddCategory ? 'showEdit' : ''"
                    >
                        <div class="add_category">
                            <el-form-item
                                ref="categorySelect-add"
                                label="商品种类-增"
                                prop="name"
                            >
                                <el-input
                                    v-model="categoryForm.name"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                ref="productPid"
                                label="种类pid"
                                prop="pid"
                            >
                                <el-input v-model="categoryForm.pid"></el-input>
                            </el-form-item>
                            <el-form-item label="种类描述" prop="description">
                                <el-input
                                    v-model="categoryForm.description"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="submitCategoryForm"
                                    >提交</el-button
                                >
                            </el-form-item>
                        </div>
                    </el-row>
                    <div class="add_category_button" @click="addCategoryFun">
                        <i
                            class="el-icon-caret-top edit_icon"
                            v-if="showAddCategory"
                        ></i>
                        <i
                            class="el-icon-caret-bottom edit_icon"
                            v-else
                            slot="icon"
                        ></i>
                        <span>添加商品种类</span>
                    </div>
                </el-form>

                <header class="form_header">商铺选择</header>
                <el-form
                    :model="shopForm"
                    ref="shopForm"
                    label-width="110px"
					:rules="shopRules"
                    class="form"
                >
                    <el-row class="category_select">
                        <el-form-item
                            ref="shopSelected"
							prop="shopSelected"
                            label="商铺选择"
							required
                        >
                            <el-select
                                v-model="shopForm.shopSelected"
                                style="width: 100%"
                                filterable
                            >
                                <el-option
                                    v-for="item in shopForm.shopData"
                                    :key="item['shop_id']"
                                    :label="item['shop_name']"
                                    :value="item['shop_id']"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                </el-form>

                <header class="form_header">添加商品</header>
                <el-form
                    :model="goodsForm"
                    ref="goodsForm"
                    label-width="110px"
					:rules="goodsRules"
                    class="form goods_form"
                >
                    <el-form-item
                        ref="name"
                        label="商品名称"
                        prop="name"
                    >
                        <el-input v-model="goodsForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品活动" prop="activity">
                        <el-input v-model="goodsForm.activity"></el-input>
                    </el-form-item>
                    <el-form-item label="商品详情" prop="description">
                        <el-input v-model="goodsForm.description"></el-input>
                    </el-form-item>
                    <el-form-item
                        ref="uploadCoverPic"
                        label="上传商品封面图像图片"
                        prop="uploadCoverPic"
                    >
                        <!--<el-upload-->
                        <!--    class="avatar-uploader"-->
                        <!--    action="javascript:"-->
                        <!--    :show-file-list="false"-->
                        <!--    :on-error="uploadImg">-->
                        <!--    <img v-if="dialogImageUrl[0]" :src="dialogImageUrl[0]" class="avatar">-->
                        <!--    <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--</el-upload>-->
                        <el-upload
                            class="upload-demo justUpload"
                            drag
                            :multiple="false"
                            action="http://localhost:3333/upload"
							:show-file-list="false"
							:on-success="handleSuccess"
							:on-remove="handleRemove"
                            :on-error="uploadImg"
                        >
                            <div v-if="!dialogImageUrl[0]">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">
                                    将文件拖到此处，或<em>点击上传</em>
                                </div>
                                <div class="el-upload__tip" slot="tip">
                                    只接受一张图片
                                </div>
                            </div>
                            <img
                                v-else
                                :src="dialogImageUrl[0]"
                                class="avatar"
                            />
                        </el-upload>
                    </el-form-item>
                    <el-form-item
                        ref="uploadProductPic"
                        label="上传商品图片"
                        prop="uploadProductPic"
                    >
                        <!--<img v-for="(item,index) in picNum" v-if="dialogImageUrl" :src="dialogImageUrl[index]"-->
                        <!--     class="picture-card avatar" @click="dialogVisible=true">-->
                        <el-upload
                            action="http://localhost:3333/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :class="{
                                fatherOfContinueUpload:
                                    dialogImageUrl.length >= 3,
                            }"
                            :on-error="uploadImg"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="" />
                        </el-dialog>
                    </el-form-item>
                    <!--<el-form-item label="商品特点">-->
                    <!--	<el-select v-model="goodsForm.attributes" multiple placeholder="请选择">-->
                    <!--	    <el-option-->
                    <!--	      	v-for="item in attributes"-->
                    <!--	      	:key="item.value"-->
                    <!--	      	:label="item.label"-->
                    <!--	      	:value="item.value">-->
                    <!--	    </el-option>-->
                    <!-- 	</el-select>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="商品规格">-->
                    <!--	<el-radio class="radio" v-model="goodsSpecs" label="one">单规格</el-radio>-->
                    <!--	<el-radio class="radio" v-model="goodsSpecs" label="more">多规格</el-radio>-->
                    <!--</el-form-item>-->
                    <el-row v-if="goodsSpecs == 'one'">
                        <!--<el-form-item label="包装费">-->
                        <!--	<el-input-number v-model="goodsForm.specs[0].goodsNum" :min="0" :max="100"></el-input-number>-->
                        <!--</el-form-item>-->
                        <el-form-item label="价格" prop="price">
                            <el-input-number
                                v-model="goodsForm.specs[0].price"
                                :min="0"
                                :max="100000"
                                req
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goodsNum">
                            <el-input-number
                                v-model="goodsForm.specs[0].goodsNum"
                                :min="0"
                                :max="10000"
                            ></el-input-number>
                        </el-form-item>
                    </el-row>
                    <el-row v-else style="overflow: auto; text-align: center">
                        <el-button
                            type="primary"
                            @click="dialogFormVisible = true"
                            style="margin-bottom: 10px"
                            >添加规格</el-button
                        >
                        <el-table
                            :data="goodsForm.specs"
                            style="margin-bottom: 20px"
                            :row-class-name="tableRowClassName"
                        >
                            <el-table-column prop="specs" label="规格">
                            </el-table-column>
                            <el-table-column prop="goodsNum" label="包装费">
                            </el-table-column>
                            <!--<el-table-column-->
                            <!--  prop="price"-->
                            <!--  label="价格">-->
                            <!--</el-table-column>-->
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="addProduct"
                            >确认添加商品</el-button
                        >
                    </el-form-item>
                </el-form>
                <el-dialog title="添加规格" v-model="dialogFormVisible">
                    <el-form :rules="specsFormrules" :model="specsForm">
                        <el-form-item
                            label="规格"
                            label-width="100px"
                            prop="specs"
                        >
                            <el-input
                                v-model="specsForm.specs"
                                auto-complete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="包装费" label-width="100px">
                            <el-input-number
                                v-model="specsForm.goodsNum"
                                :min="0"
                                :max="100"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="价格" label-width="100px">
                            <el-input-number
                                v-model="specsForm.price"
                                :min="0"
                                :max="10000"
                            ></el-input-number>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false"
                            >取 消</el-button
                        >
                        <el-button type="primary" @click="addspecs"
                            >确 定</el-button
                        >
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import headTop from "@/components/headTop";
import { getCategory, addCategory } from "@/api/getData";
import { baseImgPath } from "@/config/env";

export default {
	
    data() {
        let checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("价格不能为空"));
            } else {
                callback();
            }
        };
        let checkNumber = (rule, val, callback) => {
            const reg = /^[1-9][0-9]{2,5}$/;
            if (val.match(reg) == null) {
                return callback(new Error("id必须是3-6位的数字组成(非0开头)"));
            } else {
                callback();
            }
        };
		const checkImgNum = (rule,val,callback) => {
			console.log('@',val,this.dialogImageUrl);
			if(val.length==0){
				return callback(new Error('请上传图片'))
			}else{
				callback()
			}
		};
        return {
			// 三个form表单的验证规则
            productRules: {
				// categorySelect: { required: true,
                //         message: "请选择商品种类",
                //         trigger: "blur",
				// 	},
                name: [
                    {
                        required: true,
                        message: "请输入商品名",
                        trigger: "blur",
                    },
                    { min: 1, max: 22, message: "商品名不可以超过22个汉字" },
                ],
                pid: [
                    {
                        required: true,
                        message: "请输入商品id",
                        trigger: "blur",
                    },
                    // { validator: checkNumber,trigger: ["change", "blur"] },
                ],
            },
			shopRules: {
				// shopSelected: {required: true, message: '请选择商铺', trigger: 'blur'}
			},
			goodsRules: {
                name: 
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur",
                    }
                ,
                uploadCoverPic: [
                    {
                        validator: (rule,val,callback) => {
							console.log('@',val,this.dialogImageUrl);
							if(this.dialogImageUrl.length==0){
								return callback(new Error('请上传图片'))
							}else{
								callback()
							}
						},
						required: 'true',
                        trigger: ["blur", "change"],
                    },
                ],
				uploadProductPic: [
                    {
                        validator: checkImgNum,	
                        required: 'true',
                        trigger: ["blur", "change"],
                    },
                ],
            },

            // picNum:0,
			// 传入图片的数量
            dialogImageUrl: [],
            dialogVisible: false,
            baseUrl: "http:/localhost:3333",
            baseImgPath,
            restaurant_id: 1,
            categoryForm: {
                pid: undefined,
                categoryList: [],
                categorySelect: undefined,
                name: "",
                description: "",
            },
            shopForm: {
                shopData: [],
                shopSelected: undefined,
            },
            goodsForm: {
                name: "",
                description: "",
                price: undefined,
                image_path: "",
                activity: "",
                attributes: [],
                specs: [
                    {
                        specs: "默认",
                        goodsNum: 100,
                        price: 150,
                    },
                ],
            },
            
            attributes: [
                {
                    value: "新",
                    label: "新品",
                },
                {
                    value: "招牌",
                    label: "招牌",
                },
            ],
            showAddCategory: false,
            goodsSpecs: "one",
            dialogFormVisible: false,
            specsForm: {
                specs: "",
                goodsNum: 0,
                price: 20,
            },
            specsFormrules: {
                specs: [
                    { required: true, message: "请输入规格", trigger: "blur" },
                ],
            },
        };
    },
    components: {
        headTop,
    },
    created() {
        // if (this.$route.query.restaurant_id) {
        // 	this.restaurant_id = this.$route.query.restaurant_id;
        // }else{
        // 	this.restaurant_id = Math.ceil(Math.random()*10);
        // 	this.$msgbox({
        //       title: '提示',
        //       message: '添加商品需要选择一个商铺，先去就去选择商铺吗？',
        //       showCancelButton: true,
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       beforeClose: (action, instance, done) => {
        //         if (action === 'confirm') {
        //           this.$router.push('/addShop');
        //           done();
        //         } else {
        //         	this.$message({
        // 	            type: 'info',
        // 	            message: '取消'
        // 	        });
        //           	done();
        //         }
        //       }
        //     })
        // }
        this.initData();
    },
    computed: {
        selectValue: function () {
            return (
                this.categoryForm.categoryList[
                    this.categoryForm.categorySelect
                ] || {}
            );
        },
    },
    methods: {
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            this.dialogImageUrl.pop();
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        initData() {
            this.$http.get("/category").then(
                (res) => {
                    this.categoryForm.categoryList = res.data;
                },
                (err) => {
                    console.log(err);
                }
            );
            this.$http
                .get("/shop", {
                    params: {
                        num: 1,
                        size: 1000000,
                    },
                })
                .then((res) => {
                    this.shopForm.shopData = res.data.data;
                });
        },
        addCategoryFun() {
            this.showAddCategory = !this.showAddCategory;
            if (this.showAddCategory == false) {
                const arr = ["categorySelect-add", "productPid"];
                arr.forEach((item) => {
                    this.$refs[item].resetField();
                });
            }
        },
        submitCategoryForm(e) {
            let arr = ["name", "pid"];
            let resValidateFlag = true;
            arr.forEach((item) => {
                this.$refs.categoryForm.validateField(item, function(e) {
                    if (e) {
                        console.log(e);
                        resValidateFlag = resValidateFlag && false;
                    } else {
                        resValidateFlag = resValidateFlag && true;
                    }
                });
            });
            if (resValidateFlag) {
				// e.stopPropagation();
                this.$http
                    .post("/category/add", {
                        pid: this.categoryForm.pid,
                        name: this.categoryForm.name,
                        description: this.categoryForm.description,
                    })
                    .then((res) => {
                        if (res.data.status === "00") {
							this.$durationMes.success({
                                        message: res.data.msg,
                                    });
                            this.$http.get("/category").then(
                                (res) => {
                                    this.categoryForm.categoryList = res.data;
                                    
                                    this.categoryForm.name = "";
                                    this.categoryForm.pid = undefined;
                                    this.categoryForm.description = "";
                                },
                                (err) => {
                                    console.log(err);
                                }
                            );
                        } else {
                            this.$durationMes.error({
                                message: res.statusText,
                            });
                        }
                    });
            }
        },
        handleSuccess(res, file, fileList) {
            console.log(res);
            if (res.status === "00") {
                this.$durationMes.success({
                    message: res.msg,
                });
                this.dialogImageUrl.push(res.url);
                // this.dialogVisible=true;
                // this.picNum++;
            } else {
                this.$durationMes.error({
                    message: res.msg || "失败",
                });
            }
			console.log(this.dialogImageUrl.length);
        },

        uploadImg(err, file, fileList) {
            const uploadFile = file.raw;
            // 将uploadFile上传到服务器上
            let form = new FormData();
            // 为了那个使用action上传图片 使用的是file：binary  --->  然后配合后端的multer解析
            form.append("file", uploadFile);
            this.$http
                .post("/upload", form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    if (res.data.status === "00") {
                        this.$durationMes.success({
                            message: res.data.msg,
                        });
                        this.dialogImageUrl.push(res.data.url);
                        // this.dialogVisible=true;
                        // this.picNum++;
                    } else {
                        this.$durationMes.error({
                            message: res.data.msg || "失败",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        beforeImgUpload(file) {
            const isRightType =
                file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isRightType) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isRightType && isLt2M;
        },
        // 添加商品
        addProduct() {
            const valiForm = [
                {
                    categoryForm: ["categorySelect"],
                },
                {
                    shopForm: ["shopSelected"],
                },
                {
                    goodsForm: [
                        "name",
                        "uploadCoverPic",
                        "uploadProductPic",
                    ],
                },
            ];
            let resvali = true;

            valiForm.forEach((item) => {
                const firKey = Object.keys(item)[0];
                item[firKey].forEach((item) => {
					console.log(firKey,item);
                    this.$refs[firKey].validateField(item, (e) => {
						if (e) {
							console.log(e);
							resvali = resvali && false;
						} else {
							resvali = resvali && true;
						}
                	});
                });
            });

            // let allValidate = refArray.every(item => {
            //     return this.$refs[item].validate(v => {
            //         console.log(v,item)
            //         return v;
            //     });
            // })
            if (resvali) {
                this.$http
                    .post("/addProduct", {
                        pid: this.categoryForm.categorySelect,
                        images: this.dialogImageUrl,
                        name: this.goodsForm.name,
                        uPrice: this.goodsForm.specs[0].price,
                        productNum: this.goodsForm.specs[0].goodsNum,
                        description: this.goodsForm.description,
                        shopId: this.shopForm.shopSelected,
                    })
                    .then((res) => {
                        if (res.status == 200) {
                            if (res.data.status == "00") {
                                this.$durationMes.success({
                                    message: res.data.msg,
                                });
                            } else {
                                this.$durationMes.warning({
                                    message: res.data.msg,
                                });
                            }
                        } else {
                            this.$durationMes.error({
                                message: res.data.msg,
                            });
                        }
                    })
                    .catch((e) => console.log(e));
            } else {
                console.log("bad submit!");
            }
        },
        addspecs() {
            this.goodsForm.specs.push({ ...this.specsForm });
            this.specsForm.specs = "";
            this.specsForm.goodsNum = 0;
            this.specsForm.price = 20;
            this.dialogFormVisible = false;
        },
        handleDelete(index) {
            this.goodsForm.specs.splice(index, 1);
        },
        tableRowClassName(row, index) {
            if (index === 1) {
                return "info-row";
            } else if (index === 3) {
                return "positive-row";
            }
            return "";
        },
    },
};
</script>

<style lang="less">
@import "../style/mixin";
.form {
    min-width: 400px;
    margin-bottom: 30px;
    &:hover {
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
            0 2px 4px 0 rgba(232, 237, 250, 0.5);
        border-radius: 6px;
        transition: all 400ms;
    }
}
.goods_form {
    border: 1px solid #eaeefb;
    padding: 10px 10px 0;
}
.form_header {
    text-align: center;
    margin-bottom: 10px;
}
.category_select {
    border: 1px solid #eaeefb;
    padding: 10px 30px 10px 10px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}
.add_category_row {
    height: 0;
    overflow: hidden;
    transition: all 400ms;
    background: #f9fafc;
}
.showEdit {
    height: 235px;
}
.add_category {
    background: #f9fafc;
    padding: 10px 30px 0px 10px;
    border: 1px solid #eaeefb;
    border-top: none;
}
.add_category_button {
    text-align: center;
    line-height: 40px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid #eaeefb;
    border-top: none;
    transition: all 400ms;
    &:hover {
        background: #f9fafc;
        span,
        .edit_icon {
            color: #20a0ff;
        }
    }
    span {
        .sc(14px, #999);
        transition: all 400ms;
    }
    .edit_icon {
        color: #ccc;
        transition: all 400ms;
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
.avatar.picture-card {
    width: 120px;
    height: 120px;
    display: block;
}
.cell {
    text-align: center;
}
.avatar {
    float: left;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.justUpload .el-upload-dragger {
    width: 178px;
    height: 178px;
}
.fatherOfContinueUpload .el-upload--picture-card {
    display: none;
}
</style>
